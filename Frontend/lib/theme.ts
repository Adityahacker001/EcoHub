// lib/theme.ts

export const contractorTheme = {
  page: {
    background: "bg-slate-50",
    gradientBackground: "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100",
    formBackground: "bg-gradient-to-br from-slate-50 to-blue-100",
  },
  card: {
    container: "bg-white shadow-2xl border border-gray-100 rounded-3xl overflow-hidden transform transition-all duration-300 hover:scale-[1.005]",
    header: "p-8 md:p-10 bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg",
    title: "text-3xl md:text-4xl font-bold",
    description: "text-indigo-100 mt-3 text-lg",
    section: "p-8 border border-gray-200 rounded-2xl bg-gradient-to-br from-white to-blue-50 shadow-lg",
    content: "p-8 md:p-10",
  },
  kpiCard: {
    base: "relative p-6 overflow-hidden rounded-2xl text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl",
    workers: "bg-gradient-to-br from-blue-500 to-blue-700",
    attendance: "bg-gradient-to-br from-green-500 to-green-700",
    grievances: "bg-gradient-to-br from-orange-500 to-orange-700",
    safety: "bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-500",
    icon: "absolute -right-6 -bottom-6 h-28 w-28 text-white/10",
  },
  button: {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xl py-3.5 px-10 rounded-xl shadow-xl transition-all duration-400 ease-in-out transform hover:scale-105 hover:shadow-2xl",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 font-bold text-xl py-3.5 px-10 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105",
  },
  form: {
    label: "block text-sm font-medium text-gray-700 mb-2",
    input: "block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all",
    select: "flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all",
    textarea: "block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all",
  },
  tabs: {
    list: "grid w-full grid-cols-2 h-14 p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg",
    trigger: "flex items-center justify-center space-x-2 text-lg font-semibold text-white data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:rounded-lg transition-all duration-300 ease-in-out",
    triggerActive: "data-[state=active]:text-blue-700",
  },
  table: {
    container: "bg-gradient-to-br from-cyan-50 via-blue-50 to-emerald-100 shadow-2xl border border-gray-100 rounded-3xl overflow-hidden",
    header: "p-8 md:p-10 bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 text-white shadow-lg",
    headerTitle: "text-3xl md:text-4xl font-bold",
    headerDescription: "text-slate-300 mt-2 text-lg",
  }
};

export const workersTheme = contractorTheme;
