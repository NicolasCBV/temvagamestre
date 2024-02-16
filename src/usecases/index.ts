type TServiceExecReturn = Promise<Record<string, any>> | Promise<void> | void;
type TServiceExecInput = Record<string, any>;

export abstract class IUseCase {
	abstract exec(input?: TServiceExecInput): TServiceExecReturn;
}
