import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { HandleError } from '../utils/HandleError.js';
import { GenerateCodeError } from '../utils/getCodeError.js';
import { modules } from '../dictionary/modules.js';
import { typeError } from '../dictionary/typeError.js';

dotenv.config();

// Configuración de la conexión a PostgreSQL (Neon)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.USER}:${process.env.PASS}@${process.env.SERVER}:${process.env.DB_PORT || 5432}/${process.env.DB}`,
    ssl: process.env.DATABASE_URL || process.env.SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Función para transformar sintaxis T-SQL (@Param, [Tabla], OUTPUT, etc.) a PostgreSQL
function transformTSQLToPostgres(sqlText, paramsMap) {
    let pgSql = sqlText;
    let values = [];

    // Reemplazar corchetes T-SQL [Identificador] por Identificador (sin comillas para permitir insensibilidad a mayúsculas/minúsculas en Postgres)
    // Usamos [^\]]+ para atrapar cualquier carácter (incluyendo la 'ñ')
    pgSql = pgSql.replace(/\[([^\]]+)\]/g, '$1');

    // Manejar OUTPUT INSERTED.col para convertirlo en RETURNING col al final de la consulta
    const outputMatch = pgSql.match(/OUTPUT\s+INSERTED\.([a-zA-Z0-9_]+)/i);
    if (outputMatch) {
        // Remover la cláusula OUTPUT de su posición original
        pgSql = pgSql.replace(outputMatch[0], '');
        // Quitar un posible punto y coma al final
        pgSql = pgSql.replace(/\s*;\s*$/, '');
        // Agregar RETURNING al final de la consulta
        pgSql = pgSql + ` RETURNING ${outputMatch[1]}`;
    }

    // Reemplazar ISNULL por COALESCE
    pgSql = pgSql.replace(/\bISNULL\(/gi, 'COALESCE(');

    // Reemplazar GETDATE() por NOW()
    pgSql = pgSql.replace(/\bGETDATE\(\)/gi, 'NOW()');

    // Manejar paginación OFFSET FETCH NEXT de T-SQL
    const offsetRegex = /OFFSET\s+\(?\s*@Page\s*-\s*1\s*\)?\s*\*\s*@PageSize\s+ROWS\s+FETCH\s+NEXT\s+@PageSize\s+ROWS\s+ONLY/gi;
    if (offsetRegex.test(pgSql)) {
        const page = paramsMap['Page'] !== undefined ? Number(paramsMap['Page']) : 1;
        const pageSize = paramsMap['PageSize'] !== undefined ? Number(paramsMap['PageSize']) : 20;
        const offsetVal = (page - 1) * pageSize;
        pgSql = pgSql.replace(offsetRegex, `LIMIT ${pageSize} OFFSET ${offsetVal}`);
        delete paramsMap['Page'];
        delete paramsMap['PageSize'];
    }

    // Reemplazar parámetros @Param por $1, $2, ...
    const sortedKeys = Object.keys(paramsMap).sort((a, b) => b.length - a.length);
    let paramIndex = 1;

    for (const key of sortedKeys) {
        const val = paramsMap[key];
        const regex = new RegExp(`@${key}\\b`, 'g');
        if (regex.test(pgSql)) {
            values.push(val);
            pgSql = pgSql.replace(regex, `$${paramIndex}`);
            paramIndex++;
        }
    }

    return { text: pgSql, values };
}

// Adaptador de solicitudes compatible con pool.request().input().query()
class PostgresRequest {
    constructor(clientOrPool) {
        this.clientOrPool = clientOrPool;
        this.paramsMap = {};
    }

    input(name, type, value) {
        if (value === undefined) {
            value = type;
        }
        this.paramsMap[name] = value;
        return this;
    }

    async query(sqlText) {
        const { text, values } = transformTSQLToPostgres(sqlText, this.paramsMap);
        const res = await this.clientOrPool.query(text, values);
        return {
            recordset: res.rows || [],
            rows: res.rows || [],
            rowsAffected: [res.rowCount || 0],
            rowCount: res.rowCount || 0
        };
    }
}

// Adaptador de transacciones compatible con new sql.Transaction(pool)
class PostgresTransaction {
    constructor(pgPool) {
        this.pgPool = pgPool;
        this.client = null;
    }

    async begin() {
        this.client = await this.pgPool.connect();
        await this.client.query('BEGIN');
    }

    request() {
        if (!this.client) {
            throw new Error('Transacción no iniciada.');
        }
        return new PostgresRequest(this.client);
    }

    async commit() {
        if (this.client) {
            await this.client.query('COMMIT');
            this.client.release();
            this.client = null;
        }
    }

    async rollback() {
        if (this.client) {
            try {
                await this.client.query('ROLLBACK');
            } catch (e) {
                // Ignorar error al hacer rollback si ya se cerró
            } finally {
                this.client.release();
                this.client = null;
            }
        }
    }
}

// Agregar .request() a la instancia del pool
pool.request = function () {
    return new PostgresRequest(pool);
};

// Objeto de compatibilidad para tipos de datos de sql
const sql = {
    Int: 'INTEGER',
    BigInt: 'BIGINT',
    VarChar: 'VARCHAR',
    Char: (len) => `CHAR(${len})`,
    Text: 'TEXT',
    Bit: 'BOOLEAN',
    DateTime: 'TIMESTAMP',
    Date: 'DATE',
    Decimal: 'NUMERIC',
    Float: 'DOUBLE PRECISION',
    NVarChar: 'VARCHAR',
    Transaction: PostgresTransaction
};

const ConnectDB = async () => {
    try {
        const client = await pool.connect();
        client.release();
        console.log('✅ Conexión exitosa a PostgreSQL (Neon)');
    } catch (error) {
        const code = GenerateCodeError(modules.DATABASE, typeError.coneccionDB);
        HandleError(code, error.message, 'db/ConnectDB', error);
        throw new Error('No se pudo conectar a la base de datos PostgreSQL');
    }
};

const CloseDB = async () => {
    try {
        await pool.end();
    } catch (error) {
        const code = GenerateCodeError(modules.DATABASE, typeError.coneccionDB);
        HandleError(code, error.message, 'db/CloseDB', error);
        throw new Error('Error al cerrar la conexión con la base de datos');
    }
};

export default sql;
export { ConnectDB, CloseDB, pool, sql };