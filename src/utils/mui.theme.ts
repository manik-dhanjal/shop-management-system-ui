import { createTheme } from '@mui/material/styles';

// Extract Tailwind theme tokens
const tailwindColors = {
	gray: {
		50: '#F9FAFB',
		100: '#F3F4F6',
		200: '#E5E7EB',
		300: '#BFC4CD',
		400: '#9CA3AF',
		500: '#6B7280',
		600: '#4B5563',
		700: '#374151',
		800: '#1F2937',
		900: '#111827',
		950: '#030712',
	},
	violet: {
		50: '#F1EEFF',
		100: '#E6E1FF',
		200: '#D2CBFF',
		300: '#B7ACFF',
		400: '#9C8CFF',
		500: '#8470FF',
		600: '#755FF8',
		700: '#5D47DE',
		800: '#4634B1',
		900: '#2F227C',
		950: '#1C1357',
	},
	sky: {
		50: '#E3F3FF',
		100: '#D1ECFF',
		200: '#B6E1FF',
		300: '#A0D7FF',
		400: '#7BC8FF',
		500: '#67BFFF',
		600: '#56B1F3',
		700: '#3193DA',
		800: '#1C71AE',
		900: '#124D79',
		950: '#0B324F',
	},
	green: {
		50: '#D2FFE2',
		100: '#B1FDCD',
		200: '#8BF0B0',
		300: '#67E294',
		400: '#4BD37D',
		500: '#3EC972',
		600: '#34BD68',
		700: '#239F52',
		800: '#15773A',
		900: '#0F5429',
		950: '#0A3F1E',
	},
	red: {
		50: '#FFE8E8',
		100: '#FFD1D1',
		200: '#FFB2B2',
		300: '#FF9494',
		400: '#FF7474',
		500: '#FF5656',
		600: '#FA4949',
		700: '#E63939',
		800: '#C52727',
		900: '#941818',
		950: '#600F0F',
	},
	yellow: {
		50: '#FFF2C9',
		100: '#FFE7A0',
		200: '#FFE081',
		300: '#FFD968',
		400: '#F7CD4C',
		500: '#F0BB33',
		600: '#DFAD2B',
		700: '#BC9021',
		800: '#816316',
		900: '#4F3D0E',
		950: '#342809',
	},
};

const tailwindFontFamily = {
	inter: ['Inter', 'sans-serif'],
};

const theme = createTheme({
	palette: {
		primary: {
			main: tailwindColors.violet[500],
			light: tailwindColors.violet[300],
			dark: tailwindColors.violet[700],
			contrastText: '#FFFFFF',
		},
		secondary: {
			main: tailwindColors.sky[500],
			light: tailwindColors.sky[300],
			dark: tailwindColors.sky[700],
			contrastText: '#FFFFFF',
		},
		error: {
			main: tailwindColors.red[500],
			light: tailwindColors.red[300],
			dark: tailwindColors.red[700],
		},
		warning: {
			main: tailwindColors.yellow[500],
			light: tailwindColors.yellow[300],
			dark: tailwindColors.yellow[700],
		},
		success: {
			main: tailwindColors.green[500],
			light: tailwindColors.green[300],
			dark: tailwindColors.green[700],
		},
		info: {
			main: tailwindColors.sky[500],
			light: tailwindColors.sky[300],
			dark: tailwindColors.sky[700],
		},
		background: {
			default: tailwindColors.gray[50],
			paper: tailwindColors.gray[100],
		},
		text: {
			primary: tailwindColors.gray[900],
			secondary: tailwindColors.gray[700],
		},
	},
	typography: {
		fontFamily: tailwindFontFamily.inter.join(','),
		fontSize: 14,
		h1: { fontSize: '3rem', fontWeight: 700 },
		h2: { fontSize: '2.25rem', fontWeight: 600 },
		h3: { fontSize: '1.88rem', fontWeight: 500 },
		body1: { fontSize: '1rem', lineHeight: 1.5 },
		body2: { fontSize: '0.875rem', lineHeight: 1.5 },
	},
	shape: {
		borderRadius: 4,
	},
	zIndex: {
		tooltip: 1500,
		modal: 1300,
		snackbar: 1200,
		drawer: 1100,
	},
});

export default theme;
