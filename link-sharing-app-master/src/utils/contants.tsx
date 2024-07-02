import FontIcon from "../components/FontIcon";

export const listLinks = [
  {value: 'linkedin', label: <span>linkedin <FontIcon size={"1.6rem"} name={"linkedin"}/></span>,},
  {value: 'stack-overflow', label: <span>stack-overflow  <FontIcon size={"1.6rem"} name={"stack-overflow"}/></span>,},
  {value: 'twitch', label: <span>twitch <FontIcon size={"1.6rem"} name={"twitch"}/></span>,},
  {value: 'twitter', label: <span>twitter <FontIcon size={"1.6rem"} name={"twitter"}/></span>,},
  {value: 'youtube', label: <span>youtube <FontIcon size={"1.6rem"} name={"youtube"}/></span>,},
  {value: 'email', label: <span>email <FontIcon size={"1.6rem"} name={"email"}/></span>,},
  {value: 'facebook', label: <span>facebook <FontIcon size={"1.6rem"} name={"facebook"}/></span>,},
  {value: 'freecodecamp', label: <span>freecodecamp <FontIcon size={"1.6rem"} name={"freecodecamp"}/></span>,},
  {value: 'frontend-mentor', label: <span>frontend-mentor <FontIcon size={"1.6rem"} name={"frontend-mentor"}/></span>,},
  {value: 'github', label: <span>github <FontIcon size={"1.6rem"} name={"github"}/></span>,},
  {value: 'gitlab', label: <span>gitlab<FontIcon size={"1.6rem"} name={"gitlab"}/></span>,},
  {value: 'hashnode', label: <span>hashnode<FontIcon size={"1.6rem"} name={"hashnode"}/></span>,},

]

interface ItemInterface {
  id: string;
}

interface LinkProps extends ItemInterface {
  platform?: string;
  url?: string;
  platformValidationMessage?: string;
  urlValidationMessage?: string;
}

interface User {
  firstName: string;
  lastName: string;
  profileImage:string;
  email?: string;
}

export const urlPatterns: any = {
  linkedin: /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
  'stack-overflow': /^https:\/\/(www\.)?stackoverflow\.com\/users\/[0-9]+\/[a-zA-Z0-9-]+$/,
  twitch: /^https:\/\/(www\.)?twitch\.tv\/[a-zA-Z0-9_]+$/,
  twitter: /^https:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+$/,
  youtube: /^https:\/\/(www\.)?youtube\.com\/(channel|user)\/[a-zA-Z0-9_-]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  facebook: /^https:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+$/,
  freecodecamp: /^https:\/\/(www\.)?freecodecamp\.org\/[a-zA-Z0-9_-]+$/,
  'frontend-mentor': /^https:\/\/(www\.)?frontendmentor\.io\/profile\/[a-zA-Z0-9-]+$/,
  github: /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+$/,
  gitlab: /^https:\/\/(www\.)?gitlab\.com\/[a-zA-Z0-9_-]+$/,
  hashnode: /^https:\/\/[a-zA-Z0-9-]+\.hashnode\.dev\/?$/
};


export type { User, LinkProps };
