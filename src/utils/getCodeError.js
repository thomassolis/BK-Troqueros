import { v1 } from 'uuid';

export const GenerateCodeError = (module, typeError) => {
    return `${module}-${typeError}-${v1()}`; //genera el codigo del error
}