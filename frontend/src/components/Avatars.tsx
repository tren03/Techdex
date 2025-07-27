import { init } from '@instantdb/react';
import { useState, useEffect } from 'react';

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
    const [animatedAvatars, setAnimatedAvatars] = useState<Set<string>>(new Set());
    const [seenAvatars, setSeenAvatars] = useState<Set<string>>(new Set());
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    
    const presence = room.usePresence({
        user: true,
    });

    db.rooms.useSyncPresence(room, {
        name: userId,
        emoji: randomPokemon.emoji,
        color: randomColor,
        pokemonName: randomPokemon.name,
    });

    // Track when new avatars appear and trigger staggered animations
    useEffect(() => {
        const allAvatarIds = new Set<string>();
        
        if (presence.user) {
            allAvatarIds.add('user');
        }
        
        Object.keys(presence.peers).forEach(id => {
            allAvatarIds.add(id);
        });

        // Find new avatars that haven't been seen before
        const newAvatars: string[] = [];
        allAvatarIds.forEach(id => {
            if (!seenAvatars.has(id)) {
                newAvatars.push(id);
            }
        });

        // Update seen avatars
        if (newAvatars.length > 0) {
            setSeenAvatars(prev => new Set([...prev, ...newAvatars]));
        }

        // Animate new avatars with staggered timing
        newAvatars.forEach((id, index) => {
            setTimeout(() => {
                setAnimatedAvatars(prev => new Set([...prev, id]));
            }, index * 150); // Stagger by 150ms for each new avatar
        });

        // Clean up animations for removed avatars
        setAnimatedAvatars(prev => {
            const newSet = new Set<string>();
            prev.forEach(id => {
                if (allAvatarIds.has(id)) {
                    newSet.add(id);
                }
            });
            return newSet;
        });

        // Clean up seen avatars for removed avatars
        setSeenAvatars(prev => {
            const newSet = new Set<string>();
            prev.forEach(id => {
                if (allAvatarIds.has(id)) {
                    newSet.add(id);
                }
            });
            return newSet;
        });

        // Clean up active tooltip if avatar is removed
        if (activeTooltip && !allAvatarIds.has(activeTooltip)) {
            setActiveTooltip(null);
        }
    }, [presence.user, presence.peers, activeTooltip]);

    const handleAvatarClick = (id: string) => {
        setActiveTooltip(activeTooltip === id ? null : id);
    };

    // Close tooltip when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setActiveTooltip(null);
        };

        if (activeTooltip) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [activeTooltip]);

    return (
        <div className="fixed bottom-4 right-4 flex">
            {presence.user ? (
                <Avatar
                    key={'user'}
                    avatarId={'user'}
                    emoji={presence.user.emoji}
                    color={presence.user.color}
                    name={presence.user.name}
                    pokemonName={presence.user.pokemonName}
                    isAnimated={animatedAvatars.has('user')}
                    isTooltipActive={activeTooltip === 'user'}
                    onAvatarClick={handleAvatarClick}
                />
            ) : null}
            {Object.entries(presence.peers).map(([id, peer]) => (
                <Avatar
                    key={id}
                    avatarId={id}
                    emoji={peer.emoji}
                    color={peer.color}
                    name={peer.name}
                    pokemonName={peer.pokemonName}
                    isAnimated={animatedAvatars.has(id)}
                    isTooltipActive={activeTooltip === id}
                    onAvatarClick={handleAvatarClick}
                />
            ))}
        </div>
    );
}

function Avatar({
    avatarId,
    emoji,
    color,
    name,
    pokemonName,
    isAnimated,
    isTooltipActive,
    onAvatarClick,
}: {
    avatarId: string;
    emoji: string;
    color: string;
    name: string;
    pokemonName: string;
    isAnimated: boolean;
    isTooltipActive: boolean;
    onAvatarClick: (id: string) => void;
}) {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onAvatarClick(avatarId);
    };

    return (
        <div
            className={`${avatarClassNames} transition-all duration-500 ease-out hover:z-50 cursor-pointer ${
                isAnimated 
                    ? 'transform translate-x-0 opacity-100' 
                    : 'transform translate-x-16 opacity-0'
            } ${isTooltipActive ? 'z-50' : ''}`}
            style={{
                borderColor: color,
            }}
            onClick={handleClick}
        >
            <span style={{ fontSize: "1.5rem" }}>{emoji}</span>
            {/* Desktop hover tooltip */}
            <div className="hidden md:group-hover:flex absolute z-10 bottom-12 right-0 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <span style={{ fontSize: "1.2rem" }}>{emoji}</span>
                    <div className="flex flex-col">
                        <span className="font-medium">{pokemonName}</span>
                        <span className="text-xs text-gray-600">{name}</span>
                    </div>
                </div>
            </div>
            {/* Mobile/tablet click tooltip */}
            {isTooltipActive && (
                <div className="flex md:hidden absolute z-10 bottom-12 right-0 text-sm text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
                    <div className="flex items-center gap-2">
                        <span style={{ fontSize: "1.2rem" }}>{emoji}</span>
                        <div className="flex flex-col">
                            <span className="font-medium">{pokemonName}</span>
                            <span className="text-xs text-gray-600">{name}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const avatarClassNames =
    'group relative select-none h-10 w-10 bg-gray-50 border border-4 border-black user-select rounded-full first:ml-0 flex justify-center items-center -ml-2 first:ml-0 relative';