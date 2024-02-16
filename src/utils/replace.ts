export type TReplace<T, R> = Omit<T, keyof R> & R;
