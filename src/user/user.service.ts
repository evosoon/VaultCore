import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Like } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import { User } from './entities/User.entity';
import { Role } from './entities/Role.entity';
import { md5 } from 'src/utils';
import { LoginUserVo } from './vo/login-user.vo';
import { UserInfoVo } from './vo/user-info.vo';
import { UpdateInfoDto } from './dto/update-info.dto';

@Injectable()
export class UserService {
    
    // Redis
    @Inject(RedisService)
    private redisService:RedisService
    // TypeORM
    @InjectEntityManager()
    private manager:EntityManager

    // /user/register POST
    async register(registerUser:RegisterUserDto){
        // 查询验证码
        const captcha = await this.redisService.get(`signup_captcha_${registerUser.email}`)
        if( !captcha )throw new HttpException('验证码已失效',HttpStatus.BAD_REQUEST)
        if( registerUser.captcha !== captcha )throw new HttpException('验证码错误',HttpStatus.BAD_REQUEST)
        // 查找角色
        const foundRole = await this.manager.findOne(Role,{
            where:{ name:'管理员' },
            relations:{ users:true }
        })
        // 查找用户
        const foundUser = await this.manager.findOne(User,{ where:[{ username:registerUser.username } , { email:registerUser.email }], })
        if( foundUser )  {
            let message = foundUser.username == registerUser.username ? '该用户已被注册' : '该邮箱已被注册' 
            throw new HttpException(message,HttpStatus.BAD_REQUEST)
        }
        const newUser = new User()
        newUser.username = registerUser.username
        newUser.nickname = registerUser.nickname
        newUser.password = md5(registerUser.password)
        newUser.email = registerUser.email
        // 用户角色
        foundRole.users = [ ...foundRole.users, newUser ]

        try{
            await this.manager.transaction( async manager => {
                await manager.save(foundRole)
                await manager.save(newUser)
            })
            return '注册成功'
        }catch(e){
            Logger.log(e,UserService)
            return '注册失败'
        }
    }

    // /user/login PSOT
    async login(loginUser:LoginUserDto){

        const user = await this.manager.findOne(User,{
            where:[{username:loginUser.username},{email:loginUser.username}],
        })
        if( !user )throw new HttpException('用户不存在',HttpStatus.BAD_REQUEST)
        if(md5(loginUser.password) != user.password)throw new HttpException('密码错误',HttpStatus.BAD_REQUEST)
        const vo = new LoginUserVo()
        vo.userinfo = {
            id:user.id,
            username:user.username,
            nickname:user.nickname,
            email:user.email,
            phone_number:user.phone_number,
            user_pic:user.user_pic,
            is_frozen:user.is_frozen,
            role:user.role.name,
            createTime:user.createTime,
        }
        return vo
    }
    //
    async findUserById (id){
        const user = await this.manager.findOne(User,{
            where:{id}
        })
        return {
            id:user.id,
            username:user.username,
            role:user.role
        }
    }
    // /user/info GET
    async findUserByIdDetail(id:number){
        const data = await this.manager.findOne(User,{
            where:{id}
        })
        const vo = new UserInfoVo()
        vo.id = data.id
        vo.username = data.username
        vo.nickname = data.nickname
        vo.email = data.email
        vo.phone_number = data.phone_number
        vo.user_pic = data.user_pic
        vo.is_frozen = data.is_frozen
        vo.role = data.role.name
        vo.createTime = data.createTime
        return vo
    }

    // /user/info POST
    async updateInfo(id:number, info:UpdateInfoDto){
        const user = await this.manager.findOne(User,{
            where:{id}
        })
        if(user.phone_number !== info.phone_number) user.phone_number = info.phone_number
        if(user.user_pic !== info.user_pic) user.user_pic = info.user_pic
        if(user.nickname !== info.nickname) user.nickname = info.nickname
        try{
            await this.manager.transaction( async manager=>{
                await manager.save(user)
            })
            return '修改成功'
        }catch(e){  return '修改失败'   }
    }

  // /user/updateEmail POST
  async resetEmail(type:string,  data ,id:number ){
    const captcha = await this.redisService.get(`reset_${type}_captcha_${data.email}`)
    if( !captcha ) throw new HttpException('验证码失效',HttpStatus.BAD_REQUEST)
    if( data.captcha !== captcha ) throw new HttpException('验证码错误',HttpStatus.BAD_REQUEST)

    const user = await this.manager.findOne(User,{
        select:['id','password','email'],
        where:{id}
    })
    if(data.email)user.email = user.email
    try{await this.manager.transaction( async manager=>{
        await manager.save(user)
        })
    return '修改成功'
}catch(e){    return '修改失败'   }

}
// /user/updatePassword POST
async resetPassword(type:string,  data ){
    const captcha = await this.redisService.get(`reset_${type}_captcha_${data.email}`)
    if( !captcha ) throw new HttpException('验证码失效',HttpStatus.BAD_REQUEST)
    if( data.captcha !== captcha ) throw new HttpException('验证码错误',HttpStatus.BAD_REQUEST)
    const user = await this.manager.findOne(User,{
        select:['id','password','email'],
        where:{email:data.email}
    })
   user.password = md5(data.password)
    try{await this.manager.transaction( async manager=>{
        await manager.save(user)
        })
    return '修改成功'
}catch(e){    return '修改失败'   }

}
    // /user/list GET
    async findUserByPage(username,nickname,email,phone_number,pageNo:number,pageSize:number){

        const condition: Record<string, any> = {};

        if(username) { condition.username = Like(`%${username}%`); }
        if(nickname) { condition.nickName = Like(`%${nickname}%`); }
        if(email) { condition.email = Like(`%${email}%`); }
        if(phone_number) { condition.phone_number = Like(`%${phone_number}%`)}
        // 跳过的总数
        const slipCount = ( pageNo-1 )*pageSize
        const [users,totalCount] = await this.manager.findAndCount(User,{
            select: [ 'id', 'username', 'nickname', 'email', 'role', 'phone_number', 'is_frozen', 'user_pic', 'createTime', 'updateTime' ],
            skip:slipCount || 0,
            take:pageSize || 1000,
            where:condition
        })
        return {
            users,totalCount
        }
    }

    // /user/freeze GET
    async freeze(id){
        const user = await this.manager.findOne(User,{where:{id}})
        user.is_frozen = !user.is_frozen
        try{
            await this.manager.transaction( async (manager)=>{
                manager.save(user)
            })
            return user.is_frozen?'冻结成功':'取消冻结成功'
        }catch(e){
            return '操作失败'
        }
    }
}
