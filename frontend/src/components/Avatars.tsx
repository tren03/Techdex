import { init } from '@instantdb/react';

const db = init({
    appId: "e2b4ddf6-078b-4f92-b68b-82a367806591",
});

const room = db.room('avatars', 'avatars--1234');

// Add more Pokémon emojis and names
const pokemonList = [
    { emoji: "🐱", name: "Meowth" },
    { emoji: "🐢", name: "Squirtle" },
    { emoji: "🐉", name: "Dragonite" },
    { emoji: "🦇", name: "Zubat" },
    { emoji: "🦋", name: "Butterfree" },
    { emoji: "🐦", name: "Pidgey" },
    { emoji: "🦖", name: "Tyrantrum" },
    { emoji: "🦆", name: "Psyduck" },
    { emoji: "🦎", name: "Charmander" },
    { emoji: "🐸", name: "Bulbasaur" },
    { emoji: "🐰", name: "Scorbunny" },
    { emoji: "🦄", name: "Rapidash" },
    { emoji: "🐻", name: "Teddiursa" },
    { emoji: "🐧", name: "Piplup" },
    { emoji: "🐭", name: "Pikachu" },
    { emoji: "🦊", name: "Eevee" },
    { emoji: "🦅", name: "Braviary" },
    { emoji: "🦔", name: "Shaymin" },
    { emoji: "🦚", name: "Xatu" },
    { emoji: "🦝", name: "Zigzagoon" },
    { emoji: "🦢", name: "Swanna" },
    { emoji: "🦩", name: "Flamigo" },
    { emoji: "🦭", name: "Seel" },
    { emoji: "🦈", name: "Sharpedo" },
    { emoji: "🦐", name: "Krabby" },
    { emoji: "🦑", name: "Inkay" },
    { emoji: "🦀", name: "Kingler" },
    { emoji: "🦋", name: "Beautifly" },
    { emoji: "🦦", name: "Oshawott" },
];

const avatarColors = [
    "#FFD700", "#FF6347", "#40E0D0", "#8A2BE2", "#32CD32",
    "#FF69B4", "#1E90FF", "#FFA500", "#A0522D", "#00CED1",
];

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

const userId = Math.random().toString(36).slice(2, 6);
const randomPokemon = getRandomItem(pokemonList);
const randomColor = getRandomItem(avatarColors);

export default function InstantAvatarStack() {
    const presence = room.usePresence({
        user: true,
    });

    db.rooms.useSyncPresence(room, {
        name: userId,
        emoji: randomPokemon.emoji,
        color: randomColor,
        pokemonName: randomPokemon.name,
    });

    return (
        <div className="flex">
            {presence.user ? (
                <Avatar
                    key={'user'}
                    emoji={presence.user.emoji}
                    color={presence.user.color}
                    name={presence.user.name}
                    pokemonName={presence.user.pokemonName}
                />
            ) : null}
            {Object.entries(presence.peers).map(([id, peer]) => (
                <Avatar
                    key={id}
                    emoji={peer.emoji}
                    color={peer.color}
                    name={peer.name}
                    pokemonName={peer.pokemonName}
                />
            ))}
        </div>
    );
}

function Avatar({
    emoji,
    color,
    name,
    pokemonName,
}: {
    emoji: string;
    color: string;
    name: string;
    pokemonName: string;
}) {
    return (
        <div
            className={avatarClassNames}
            style={{
                borderColor: color,
            }}
        >
            <span style={{ fontSize: "1.5rem" }}>{emoji}</span>
            <div className="hidden group-hover:flex absolute z-10 bottom-10 text-sm text-gray-800 bg-gray-200 rounded px-2 py-1">
                {pokemonName}
            </div>
        </div>
    );
}

const avatarClassNames =
    'group relative select-none h-10 w-10 bg-gray-50 border border-4 border-black user-select rounded-full first:ml-0 flex justify-center items-center -ml-2 first:ml-0 relative';
