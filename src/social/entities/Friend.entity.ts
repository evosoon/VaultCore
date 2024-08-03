import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('firends')
export class Friend {
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        comment:'用户1id'
    })
    user_id:number

    @Column({
        comment:'用户2id'
    })
    friend_id:number

    @Column({
        comment:'用户1的分组',
        length:20,
        default:'默认分组'
    })
    user_group:string

    @Column({
        comment:'用户2的分组',
        length:20,
        default:'默认分组'
    })
    friend_group:string
}