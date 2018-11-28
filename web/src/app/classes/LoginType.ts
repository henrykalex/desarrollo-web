export enum LoginType {
    MASTER = 'master',
    DISTRIBUTOR = 'distributor',
    VETERINARY = 'veterinary',
    CLIENT = 'client'
}

export class TypeFunctions {
  static parseUserLink(userDisplayType){
    return userDisplayType == LoginType.DISTRIBUTOR?'distribuidor':
    userDisplayType == LoginType.VETERINARY?'veterinario':
    userDisplayType == LoginType.CLIENT?'cliente': 'cliente';
  }
}
