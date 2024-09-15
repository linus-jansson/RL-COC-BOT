const API_URL = `https://api.clashofclans.com/v1`;
export const ROYAL_LEGENDS_CLAN_TAG = `#2PLJVU9YR`;
export const PLAYER_VERIFY_API_URL = (p_tag:string) => `${API_URL}/players/${p_tag}/verifytoken`;
export const PLAYER_API_URL = (p_tag:string) => `${API_URL}/players/${p_tag}`;