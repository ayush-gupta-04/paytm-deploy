"use client"
export const Select = ({ options }: {
    options: {
        key: string;
        value: string;
    }[];
}) => {
    return <select className="hover:bg-slate-50 border border-slate-400 text-gray-900 text-sm rounded-lg block w-full p-4 font-semibold">
        {options.map((option )=> <option value={option.key} className="font-semibold">{option.value}</option>)}
  </select>
}