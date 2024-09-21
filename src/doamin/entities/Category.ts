export interface ICategory{
    _id?:string
    name:string,
    description:string
    isDeleted?:boolean
    image?:string
}

export interface IEditCategory{
    name: string,
    description: string,
    image?:string|undefined
}