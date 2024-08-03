import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('goods')
export class Goods {
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        comment:'货品名称'
    })
    name:string

    @Column({
        comment:'货品数量'
    })
    quantity:number

    @Column({
        comment:'货品价格',
    })
    price:string

    @CreateDateColumn()
    createTime: Date;
}