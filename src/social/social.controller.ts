import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { SocialService } from './social.service';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { FriendAddDto } from './dto/friend-add.dto';
import { generateParseIntPipe } from 'src/utils';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('社交')
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @ApiOperation({summary:'查询好友'})
  @Get('friend')
  @RequireLogin()
  async friendList(@UserInfo('userId') id:number) {
    return await this.socialService.friendList(id)
  }

  @ApiOperation({summary:'添加好友'})
  @ApiBody({type:FriendAddDto})
  @Post('friend')
  @RequireLogin()
  async friendAdd(@UserInfo('userId') userId:number, @Body() friendAddDto:FriendAddDto){
    return await this.socialService.friendAdd(userId,friendAddDto)
  }

  @ApiOperation({summary:'删除好友'})
  @Delete('friend')
  @RequireLogin()
  async friendDelete(@UserInfo('userId') userId:number, @Query('friendId',generateParseIntPipe('friendId')) friendId:number){
    return await this.socialService.friendDelect(userId,friendId)
  }
}

