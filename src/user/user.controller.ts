import { BadRequestException, Body, Controller, Get, Inject, ParseIntPipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RequireIdentity, RequireLogin, UserInfo } from 'src/custom.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateInfoDto } from './dto/update-info.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { generateParseIntPipe } from 'src/utils';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from "multer";
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('用户')
@Controller('user')
export class UserController {

  @Inject(JwtService)
  private jwtService: JwtService

  @Inject(ConfigService)
  private configService: ConfigService

  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: '注册' })
  @ApiBody({ type:RegisterUserDto})
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.userService.register(registerUserDto)
  }

  @ApiOperation({ summary: '登录' })
  @ApiBody({ type:LoginUserDto})
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const vo = await this.userService.login(loginUserDto)
    const { access_token, refresh_token } = this.signJwt(vo.userinfo)
    vo.access_token = access_token
    vo.refresh_token = refresh_token
    return vo
  }

  @ApiOperation({ summary: '刷新Jwt' })
  @Get('refresh_token')
  async refresh(@Query('refresh_token') token: string) {
    const data = this.jwtService.verify(token)
    const userinfo = await this.userService.findUserById(data.userId)
    return this.signJwt(userinfo)
  }

  @ApiOperation({ summary: '获取信息' })
  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId', ParseIntPipe) userId: number) {
    return await this.userService.findUserByIdDetail(userId)
  }

  @ApiOperation({ summary: '修改信息' })
  @ApiBody({ type:UpdateInfoDto})
  @Post('info')
  @RequireLogin()
  async updateInfo(@UserInfo('userId', ParseIntPipe) id: number, @Body() info: UpdateInfoDto) {
    return await this.userService.updateInfo(id, info)
  }

  @ApiOperation({ summary: '上传头像' })
  @Post('upload')
  @RequireLogin()
  @UseInterceptors(FileInterceptor('file', {
    dest: 'uploads',
    limits:{
      fileSize:1024*1024*10
    },
    storage:multer.diskStorage({
      destination:function(req,file,cb) {
        try {
          fs.mkdirSync('uploads')
        } catch(e) {}
        cb(null,'uploads')
      },filename:function(req,file,cb) {
        const uniqueSuffix =req.user.username+file.originalname.slice(-4)
        cb(null,uniqueSuffix)
      }
    })
    ,
    fileFilter(req, file, callback) {
      const extname = path.extname(file.originalname);       
      if(['.jpg', '.png', '.gif'].includes(extname)) {
        callback(null,true)
      }else{
        callback(new BadRequestException('只能上传图片'),false)
      }
    }
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return file.path;
  }


  @ApiOperation({ summary: '修改邮箱' })
  @ApiBody({ type:UpdateEmailDto})
  @Post('updateEmail')
  @RequireLogin()
  async updateEmail(@UserInfo('userId', ParseIntPipe) id: number, @Body() data: UpdateEmailDto) {
    const type = 'email'
    return await this.userService.resetEmail(type, data, id)
  }

  @ApiOperation({ summary: '修改密码' })
  @ApiBody({ type:UpdatePasswordDto})
  @Post('updatePassword')
  // @RequireLogin()
  async updatePassword( @Body() data: UpdatePasswordDto) {
    const type = 'password'
    return await this.userService.resetPassword(type, data)
  }


  @ApiOperation({ summary: '用户列表' })
  @Get('list')
  @RequireLogin()
  @RequireIdentity('管理员')
  async list(
    @Query('username') username: string,
    @Query('nickname') nickname: string,
    @Query('email') email: string,
    @Query('phone_number') phone_number: string,
    @Query('pageNo') pageNo: number,
    @Query('pageSize') pageSize: number) {
    return await this.userService.findUserByPage(username, nickname, email, phone_number, pageNo, pageSize)
  }

  @ApiOperation({ summary: '冻结用户' })
  @Get('freeze')
  @RequireLogin()
  @RequireIdentity('管理员')
  async freeze(@Query('id') id: number) {
    return await this.userService.freeze(id)
  }

  signJwt(userinfo) {
    const access_token = this.jwtService.sign({
      userId: userinfo.id,
      username: userinfo.username,
      role: userinfo.role
    }, {
      expiresIn: this.configService.get('jwt_token_expires_time_access') || '30m'
    })
    const refresh_token = this.jwtService.sign({
      userId: userinfo.id
    }, {
      expiresIn: this.configService.get('jwt_expires_time_refresh') || '7d'
    })
    return {
      access_token, refresh_token
    }
  }
}
