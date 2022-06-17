import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";
import { IUsersRespository } from "../../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";

export class CreateUserUseCase {
    constructor(
        private usersRepository: IUsersRespository,
        private mailProvider: IMailProvider,
    ) {}

    async execute(data: ICreateUserRequestDTO) {
        const userAlreadyExits = await this.usersRepository.findByEmail(data.email);

        if (userAlreadyExits) {
            throw new Error('User already exists.');
        }

        const user = new User(data);

        await this.usersRepository.save(user);

        await this.mailProvider.sendMail({
            to: {
                name: data.name,
                email: data.email,
            },
            from: {
                name: 'Equipe do Meu App',
                email: 'equipe@meuapp.com',
            },
            subject: 'Seja bem-vindo à plataforma',
            body: '<p>Você já pode fazer login em nossa plataforma.</p>'
        })
    }
}