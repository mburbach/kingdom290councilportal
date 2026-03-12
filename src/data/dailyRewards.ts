export type RewardLinkSet = {
    totalBattle: string;
    triumph: string;
    mobile: string;
};

export type DailyReward = {
    day: string;
    title: string;
    keyword: string;
    links: RewardLinkSet;
};

const TOTAL_BATTLE_BASE_URL = "https://totalbattle.com/?present=";
const TRIUMPH_BASE_URL = "https://triumph.totalbattle.com/?present=";

export const dailyRewards: DailyReward[] = [
    {
        day: "Monday",
        title: "500 Gold",
        keyword: "gold",
        links: {
            totalBattle: `${TOTAL_BATTLE_BASE_URL}gold`,
            triumph: `${TRIUMPH_BASE_URL}gold`,
            mobile: "https://totalbattle.onelink.me/Xsl6/h3n9bz4l",
        },
    },
    {
        day: "Tuesday",
        title: "XP",
        keyword: "xp",
        links: {
            totalBattle: `${TOTAL_BATTLE_BASE_URL}xp`,
            triumph: `${TRIUMPH_BASE_URL}xp`,
            mobile: "https://totalbattle.onelink.me/Xsl6/atjav1j0",
        },
    },
    {
        day: "Wednesday",
        title: "1500 Tar",
        keyword: "tar",
        links: {
            totalBattle: `${TOTAL_BATTLE_BASE_URL}tar`,
            triumph: `${TRIUMPH_BASE_URL}tar`,
            mobile: "https://totalbattle.onelink.me/Xsl6/xp7gbljw",
        },
    },
    {
        day: "Thursday",
        title: "25p Speedups",
        keyword: "march25",
        links: {
            totalBattle: `${TOTAL_BATTLE_BASE_URL}march25`,
            triumph: `${TRIUMPH_BASE_URL}march25`,
            mobile: "https://totalbattle.onelink.me/Xsl6/gbwfnf2t",
        },
    },
    {
        day: "Friday",
        title: "500 Gold",
        keyword: "gold500",
        links: {
            totalBattle: `${TOTAL_BATTLE_BASE_URL}gold500`,
            triumph: `${TRIUMPH_BASE_URL}gold500`,
            mobile: "https://totalbattle.onelink.me/Xsl6/e08dg3he",
        },
    },
    {
        day: "Saturday",
        title: "4x15m Speedup",
        keyword: "speedups15",
        links: {
            totalBattle: `${TOTAL_BATTLE_BASE_URL}speedups15`,
            triumph: `${TRIUMPH_BASE_URL}speedups15`,
            mobile: "https://totalbattle.onelink.me/Xsl6/shl7uy9z",
        },
    },
    {
        day: "Sunday",
        title: "3h Speedups",
        keyword: "speedups3",
        links: {
            totalBattle: `${TOTAL_BATTLE_BASE_URL}speedups3`,
            triumph: `${TRIUMPH_BASE_URL}speedups3`,
            mobile: "https://totalbattle.onelink.me/Xsl6/hk7nqk5m",
        },
    },
];

export const getRewardByDay = (day: string) =>
    dailyRewards.find(
        (reward) => reward.day.toLowerCase() === day.toLowerCase()
    );