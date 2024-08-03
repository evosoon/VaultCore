interface Userinfo {
    id:number
    username:string
    nickname:string
    email:string
    phone_number:string
    user_pic:string
    is_frozen:boolean
    role:string
    createTime:Date
}

export class LoginUserVo {
    userinfo:Userinfo
    access_token:string
    refresh_token:string
}