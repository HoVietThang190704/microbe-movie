import s3Config from '../../config/s3.config';

type S3ConfigType = ReturnType<typeof s3Config>;

export type S3ConfigKey = keyof S3ConfigType;

export type S3Config = S3ConfigType[S3ConfigKey];
