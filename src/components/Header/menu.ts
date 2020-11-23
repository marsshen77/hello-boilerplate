export interface MenuProps {
    title: string;
    englishTitle: string;
    path: string;
    newTab?: boolean;
}

export const menuConfig: MenuProps[] = [
    { title: '云图可视化', path: 'cloud', englishTitle: 'Cloud visualization' },
    { title: '业务空间分析', path: 'business', englishTitle: 'Business space analysis' },
    {
        title: '大屏可视化系统',
        path: 'visualization',
        englishTitle: 'Visualization system',
        newTab: true
    }
];
