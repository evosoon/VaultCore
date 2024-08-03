import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Friend } from './entities/Friend.entity';
import { FriendAddDto } from './dto/friend-add.dto';
import { User } from 'src/user/entities/User.entity';

@Injectable()
export class SocialService {

    @InjectEntityManager()
    private manager:EntityManager

    // /social/friend GET
    async friendList(id:number){
        const [data,totalCount] = await this.manager.findAndCount(Friend,{
            where:[{user_id:id},{friend_id:id}]
        })
        return {
            data,totalCount
        }
    }

    // /social/friend POST
    async friendAdd(userId:number,friendAddDto:FriendAddDto){

        const {id,friendGroup} = friendAddDto
        const foundUser = await this.manager.findOne(User,{where:{id}})
        if(!foundUser) throw new HttpException('该用户无效',HttpStatus.BAD_REQUEST)
        const NewFriend = new Friend()
        if(userId<id){
            NewFriend.user_id=userId;
            NewFriend.friend_id=id;
            NewFriend.friend_group = friendGroup?friendGroup:'默认分组'
        }
        else if(userId>id){
            NewFriend.user_id=id;
            NewFriend.friend_id=userId;
            NewFriend.user_group = friendGroup?friendGroup:'默认分组'
        }
        else throw new HttpException('这是你自己',HttpStatus.BAD_REQUEST)

        const findUser = await this.manager.findOne(Friend,{
            where:{user_id:NewFriend.user_id,friend_id:NewFriend.friend_id}
        })
        if(findUser)throw new HttpException('用户已是好友',HttpStatus.BAD_REQUEST)
        try{
            await this.manager.transaction( async manager=>{
                await manager.save(NewFriend)
            })
            return '添加成功'
        }catch(e){
            return '添加失败'
        }
    }

    // /social/friend DELETE
    async friendDelect(userId:number,friendId:number){
        const NewFriend = new Friend()
        if(userId<friendId){
            NewFriend.user_id=userId;
            NewFriend.friend_id=friendId;
        }
        else if(userId>friendId){
            NewFriend.user_id=friendId;
            NewFriend.friend_id=userId;
        }
        else throw new HttpException('这是你自己',HttpStatus.BAD_REQUEST)
        const findFriend = await this.manager.findOne(Friend,{
            where:{user_id:NewFriend.user_id,friend_id:NewFriend.friend_id}
        })
        if(!findFriend)throw new HttpException('出错了',HttpStatus.BAD_REQUEST)
        try{
            this.manager.transaction( async manager=>{
                await manager.delete(Friend,findFriend.id)
            })
            return '删除成功'
        }catch(e){
            return '删除失败'
        }
    }
}

