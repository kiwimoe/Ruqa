import type {
    EmbedAuthorOptions,
    EmbedField,
    EmbedFooterOptions,
    EmbedImage,
} from "eris";
import EmbedColor from "@config/embed_config.json";

export default class RichEmbed {
    public author?: EmbedAuthorOptions;

    public title?: string;

    public description?: string;

    public url?: string;

    public color?: number;

    public timestamp?: string | Date;

    public thumbnail?: EmbedImage;

    public image?: EmbedImage;

    public footer?: EmbedFooterOptions;

    public fields?: EmbedField[];

    public setAuthor(name: string, url?: string, iconURL?: string): this {
        this.author = {
            name,
            url,
            icon_url: iconURL ?? undefined,
        };
        return this;
    }

    public setTitle(title: string): this {
        this.title = title;
        return this;
    }

    public setDescription(description: string): this {
        this.description = description;
        return this;
    }

    public setURL(url: string): this {
        this.url = url;
        return this;
    }

    public setColor(color: string | number): this {
        if (color === "RANDOM") {
            this.color = ~~(Math.random() * (0xffffff + 1));
        } else {
            this.color = Number(color);
        }
        return this;
    }

    public setImage(url: string, height?: number, width?: number): this {
        this.image = {
            url,
            height,
            width,
        };
        return this;
    }

    public setThumbnail(url: string, height?: number, width?: number): this {
        this.thumbnail = {
            url,
            height,
            width,
        };
        return this;
    }

    public setFooter(text: string, iconURL?: string): this {
        this.footer = {
            text,
            icon_url: iconURL ?? undefined,
        };
        return this;
    }

    public setTimestamp(timestamp?: string): this {
        this.timestamp = timestamp ?? new Date();
        return this;
    }

    public addField(name: string, value: string, inline: boolean = false): this {
        if (!this.fields) {
            this.fields = [];
        }
        this.fields.push({ name, value, inline });
        return this;
    }

    public static get embedColor(): number {
        return Number(EmbedColor.color);
    }
}
