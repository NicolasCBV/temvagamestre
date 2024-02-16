export abstract class LoggerAdapter {
	abstract info: (input: any) => void;
	abstract warn: (input: any) => void;
	abstract debug: (input: any) => void;
	abstract error: (input: any) => void;
}
