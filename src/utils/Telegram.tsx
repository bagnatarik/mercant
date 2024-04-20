export default interface UserFromTelegram {
    id: string | undefined,
    first_name: string | undefined,
    last_name: string | undefined
}

export function parseFromTelegram(): UserFromTelegram {
    const initDataString: string = window.Telegram.WebApp.initData

    const params = new URLSearchParams(initDataString)

    let initData: UserFromTelegram = {
        id: undefined,
        first_name: undefined,
        last_name: undefined,
    }

    params.forEach(function (value, key) {
        if (key === 'user' && value.startsWith('{') && value.endsWith('}')) {
            initData = JSON.parse(value)
        }
    });

    return initData
}