import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequireIdentity, RequireLogin, UserInfo } from 'src/custom.decorator';
import { GoodsAddDto } from './dto/goods-add.dto';

interface UInfo {
  userId:number,
  username:string,
  role:string | number
}

@ApiTags('库存')
@Controller('goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @ApiOperation({summary:'查询库存'})
  @Get('goods')
  @RequireLogin()
  async goodsGet(@UserInfo() userInfo:UInfo, @Query('name') name: string) {
    return this.goodsService.GetGoods(name)
  }

  @ApiOperation({summary:'添加货物'})
  @ApiBody({type:GoodsAddDto})
  @Post('goods')
  @RequireIdentity('管理员')
  @RequireLogin()
  async goodsAdd(@UserInfo() userInfo:UInfo, @Body() goodsAddDto:GoodsAddDto){
    return this.goodsService.AddGoods(userInfo,goodsAddDto)
  }

  @ApiOperation({summary:'删除货物'})
  @Delete('goods')
  @RequireIdentity('管理员')
  @RequireLogin()
  async goodsDel(@UserInfo() userInfo:UInfo, @Query('name') name: string){
    return this.goodsService.DelGoods(userInfo,name)
  }
  
  @ApiOperation({summary:'获取日志'})
  @Get('record')
  @RequireIdentity('管理员')

  @RequireLogin()
  async recordGet(@UserInfo() userInfo:UInfo, @Query('type') type: string){
    return this.goodsService.GetRecord(userInfo,type)
  }
}
