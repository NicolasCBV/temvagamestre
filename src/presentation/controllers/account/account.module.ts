import { Module } from '@nestjs/common';
import { AddUserController } from './add-user.controller';
import { AddAccountUseCase } from '@usecases/add-account.service';
import { JwtService } from '@nestjs/jwt';

@Module({
	controllers: [AddUserController],
	providers: [AddAccountUseCase, JwtService],
})
export class AccountControllerModule {}
