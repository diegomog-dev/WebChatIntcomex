export default async function reqApi(parameter, count, numberPage){
    const api = await fetch(`https://webapitestintcomex.azurewebsites.net/api/Product/GetSearchProducts?parameter=${parameter}&count=${count}&numberPage=${numberPage}`);
    const productApi = await api.json();
    return productApi;
}