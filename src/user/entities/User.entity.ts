import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Role } from "./Role.entity";

@Entity({name:'users'})
export class User {
    @PrimaryGeneratedColumn()
    id:number

    @Column({
        unique:true,
        length:50,
        comment:'用户名'
    })
    username:string

    @Column({
        length:50,
        comment:'密码'
    })
    password:string

    @Column({
        length:50,
        comment:'昵称'
    })
    nickname:string

    @Column({
        unique:true,
        length:50,
        comment:'邮箱'
    })
    email:string

    @Column({
        length:100,
        nullable:true,
        comment:'头像'
    })
    user_pic:string
    @Column({
        length:20,
        nullable:true,
        comment:'手机号'
    })
    phone_number:string

    @Column({
        comment: '是否冻结',
        default: false
    })
    is_frozen: boolean;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;

    @ManyToOne(()=>Role,{ nullable: false, eager: true })
    @JoinColumn({ name: 'roleId' })
    role:Role
}