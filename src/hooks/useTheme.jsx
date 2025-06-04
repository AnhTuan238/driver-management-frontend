import { useEffect, useState } from 'react';

const THEME_KEY = 'theme';

export default function useTheme() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem(THEME_KEY) || 'light';
    });

    useEffect(() => {
        document.documentElement.classList.remove(theme === 'dark' ? 'light' : 'dark');
        document.documentElement.classList.add(theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme };
}
