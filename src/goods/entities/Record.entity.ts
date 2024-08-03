import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('record')
export class Record {
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        comment:'操作人id'
    })
    user_id:number

    @Column({
        comment:'操作人id'
    })
    user_name:string

    @Column({
        comment:'操作类型'
    })
    type:string

    @Column({
        comment:'操作单位',
    })
    goods_about:string

    @CreateDateColumn()
    createTime: Date;
}