import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User.entity";

@Entity({name:'roles'})
export class Role {
    @PrimaryGeneratedColumn()
    id:number
    @Column({
        length:50,
        comment:'名称'
    })
    name:string
    @OneToMany(()=>User,
    user=>user.role,    // 指定外键在哪维护
    {cascade:true})
    users:User[]
}