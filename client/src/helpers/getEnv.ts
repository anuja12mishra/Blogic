export const getEnv = (envname: string): string | undefined => {
    const env = import.meta.env;
    return env[envname];
}
