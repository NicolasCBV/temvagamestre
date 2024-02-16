import { AddAccountUseCase } from '@usecases/add-account.service';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AddAccountDTO } from '../../dto/addUser.DTO';

@Controller('account')
export class AddUserController {
	constructor(private readonly addAccountUseCase: AddAccountUseCase) {}

	@HttpCode(201)
	@Post()
	async execute(@Body() body: AddAccountDTO) {
		const { token } = await this.addAccountUseCase.exec({ ...body });
		return { accessToken: token };
	}
}
