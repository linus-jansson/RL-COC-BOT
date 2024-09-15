import { config } from "@/config";
import { PLAYER_API_URL, PLAYER_VERIFY_API_URL, ROYAL_LEGENDS_CLAN_TAG } from "@/constants";
import { logger } from "@/lib/logger";
import type { Player } from "@/types/CocApi";

export async function verifyPlayerToken(p_tag: string, token: string) : Promise<boolean | null>  {
    const body = { token: token}
    try {
        // URL encode the player tag
        p_tag = encodeURIComponent(p_tag);
        const response = await fetch(PLAYER_VERIFY_API_URL(p_tag), {
            headers: {
                Authorization: `Bearer ${config.apiToken}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(body),
        })
        if (!response.ok) {
            let error = await response.json();
            console.error(error);
            throw error;
        }
        const data = await response.json();
        console.log(data);
        return data.status === 'ok';
    } catch (error) {
        logger.error("Failed to verify token due to error ", error);
        return null;
    }
}

type Role = 'Leader' | 'CoLeader' | 'Elder' | 'Member';
type SimplifiedPlayer = {
    name: string;
    role: Role;
}
export async function getPlayerRole(p_tag: string): Promise<SimplifiedPlayer | null> {
    try {
        // URL encode the player tag
        p_tag = encodeURIComponent(p_tag);
        const response = await fetch(PLAYER_API_URL(p_tag), {
            headers: {
                Authorization: `Bearer ${config.apiToken}`,
            },
        })

        if (!response.ok) {
            let error = await response.json();
            throw error;
        }

        const data = await response.json() as Player;

        if (data?.clan?.tag !== ROYAL_LEGENDS_CLAN_TAG  || !data?.name
        ) {
            return null;
        }
        console.log(data.role, data.clan.tag, ROYAL_LEGENDS_CLAN_TAG);
        if(!data.role || data.role === 'NOT_MEMBER')
        {
            return null;
        }
        
        // Map the role to the more discord friendly role because the role names are different in discord
        let roles = {
            'LEADER': 'Leader',
            'COLEADER': 'CoLeader',
            'ADMIN': 'Elder',
            'MEMBER': 'Member',
        } as Record<string, Role>;
        return {
            name: data.name,
            role: roles[data.role],
        }
    } catch (error) {
        logger.error("Failed to get player info due to error ", error);
        return null;
    }
}