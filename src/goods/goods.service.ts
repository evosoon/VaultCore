import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Like } from 'typeorm';
import { Goods } from './entities/Goods.entity';
import { GoodsAddDto } from './dto/goods-add.dto';
import { GoodsDelDto } from './dto/goods-del.dto';
import { Record } from './entities/Record.entity';

interface UInfo {
    userId:number,
    username:string,
    role:string | number
  }

@Injectable()
export class GoodsService {
    @InjectEntityManager()
    private manager:EntityManager

    // getGoods GET
    async GetGoods(name:string){

        const condition :any = new Record();

        if(name) { condition.name = Like(`%${name}%`); }
        const [data,totalCount] = await this.manager.findAndCount(Goods,{
            select: [ 'id', 'name', 'price', 'quantity',"createTime"],
            where:condition
        })
        return {  data,totalCount }
    }

    // addGoods POST
    async AddGoods(userInfo:UInfo,goodsAddDto:GoodsAddDto){

        const {name,quantity,price} = goodsAddDto
        const condition :any = new Record();

        if(name) { condition.name = Like(`%${name}%`); }
        const foundGooods = await this.manager.findOne(Goods,{
            select: [ 'id', 'name', 'price', 'quantity'],
            where:condition
        })
        if(foundGooods){
            foundGooods.name     = name
            foundGooods.quantity = quantity
            foundGooods.price    = price
            try{
                await this.manager.transaction( async manager=>{
                    await manager.save(foundGooods)
                })
                const newRecord = new Record();
                newRecord.user_id = userInfo.userId;
                newRecord.user_name = userInfo.username;
                newRecord.type = 'UPDATE';
                newRecord.goods_about = name;
                await this.manager.save(newRecord);
                return '修改成功'
            }catch(e){
                return '修改失败'
            }
        } else {
            const newGoods = new Goods()
            newGoods.name     = name
            newGoods.quantity = quantity
            newGoods.price    = price
            try{
                await this.manager.transaction( async manager=>{
                    await manager.save(newGoods)
                })
                const newRecord = new Record();
                newRecord.user_id = userInfo.userId;
                newRecord.user_name = userInfo.username;
                newRecord.type = 'ADD';
                newRecord.goods_about = name;
                await this.manager.save(newRecord);
                return '添加成功'
            }catch(e){
                return '添加失败'
            }
        }
      
    }

    // delGoods DELETE
    async DelGoods(userInfo:UInfo,name:string){
        const foundGooods = await this.manager.findOne(Goods,{
            where:{name}
        })
        if(!foundGooods)throw new HttpException('出错了',HttpStatus.BAD_REQUEST)
        try{
            this.manager.transaction( async manager=>{
                await manager.delete(Goods,{name})
            })
            const newRecord = new Record();
            newRecord.user_id = userInfo.userId;
            newRecord.user_name = userInfo.username;
            newRecord.type = 'DEL';
            newRecord.goods_about = name;
            await this.manager.save(newRecord);
            return '删除成功'
        }catch(e){
            return '删除失败'
        }
    }
    async GetRecord(userInfo:UInfo,type:string){
        const condition :any = new Record();

        if(type) { condition.type = Like(`%${type}%`); }
        const  [data,totalCount] = await this.manager.findAndCount(Record,{
            select: [ 'id', 'user_id', 'user_name', 'type','goods_about','createTime'],
            where:condition
        })
        return {  data,totalCount }
    }
}
