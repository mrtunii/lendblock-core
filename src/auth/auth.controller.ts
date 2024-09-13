import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ValidateTokenDTO } from './dtos/validate-token.dto';
import { Response as ResponseObject } from '../shared/utils/response';
import { ethers } from 'ethers';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ResponseCode } from '../shared/utils/response-codes.enum';
import { Contract } from 'ethers-ts';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
  ) {}

  @Post('token/validate')
  async validateToken(
    @Body() validateTokenDTO: ValidateTokenDTO,
    @Res() res: Response,
  ) {
    const responseObject = new ResponseObject();

    const recoveredAddress = ethers.utils.verifyMessage(
      validateTokenDTO.message,
      validateTokenDTO.signature,
    );

    if (
      recoveredAddress.toLowerCase() === validateTokenDTO.address.toLowerCase()
    ) {
      const user = await this._userService.upsert({
        walletAddress: validateTokenDTO.address,
      });

      const tokenPayload = {
        sub: user.id,
        walletAddress: user.walletAddress,
      };
      const token = await this._jwtService.signAsync(tokenPayload);
      responseObject.setData({
        user,
        token,
      });

      return res.status(ResponseCode.Created).json(responseObject);
    } else {
      responseObject.setError('Signature is invalid.');
      return res.status(ResponseCode.BadRequest).json(responseObject);
    }
  }

  @Get('eth/price')
  async getETHPrice() {
    const provider = new ethers.providers.JsonRpcProvider(
      'https://rpc.public.curie.radiumblock.co/ws/ethereum',
    );
    const aggregatorV3InterfaceABI = [
      {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'description',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint80', name: '_roundId', type: 'uint80' }],
        name: 'getRoundData',
        outputs: [
          { internalType: 'uint80', name: 'roundId', type: 'uint80' },
          { internalType: 'int256', name: 'answer', type: 'int256' },
          { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
          { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
          { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'latestRoundData',
        outputs: [
          { internalType: 'uint80', name: 'roundId', type: 'uint80' },
          { internalType: 'int256', name: 'answer', type: 'int256' },
          { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
          { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
          { internalType: 'uint80', name: 'answeredInRound', type: 'uint80' },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'version',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ];
    const ETH_USD_RATE_ADDRESS = '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419';
    const priceFeed = new Contract(
      ETH_USD_RATE_ADDRESS,
      aggregatorV3InterfaceABI,
      provider,
    );

    const data = await priceFeed.latestRoundData();
    const price = ethers.utils.formatUnits(data[1], 8);
    console.log(price);
    return price;
  }
}
