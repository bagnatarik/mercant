/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useEffect, useRef, useState } from "react";
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { API } from "../services/API";

export default function CategoriesButton({ setCategory }: { setCategory: CallableFunction }) {
    const categoryService: API = new API();
    const [categories, setCategories] = useState<any[] | null>(null)

    const [selected, setSelected] = useState<any | null>(null)

    const ref = useRef(false);

    const fetch = async () => {
        const response = await categoryService.getAllCategories()
        if (response) {
            setCategories(response)
            setSelected(response[0])
            setCategory(response[0])
        }
    }

    useEffect(() => {
        if (ref.current === false) {
            fetch()
        }
        return () => {
            ref.current = true
        }
    })


    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <>
            <div className="w-full px-2 py-2">
                {
                    (categories && selected) && (
                        <Listbox value={selected} onChange={setSelected}>
                            {({ open }) => (
                                <>
                                    {/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Listbox.Label> */}
                                    <div className="relative w-full">
                                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-3 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                            <span className="flex items-center">
                                                <span className="ml-3 block truncate">{selected.name}</span>
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </span>
                                        </Listbox.Button>

                                        <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Listbox.Options className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                {categories.map((category: any) => (
                                                    <Listbox.Option
                                                        key={category.id}
                                                        className={({ active }) =>
                                                            classNames(
                                                                active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                                            )
                                                        }
                                                        value={category}
                                                        onClick={() => {
                                                            setCategory(category)
                                                        }}
                                                    >
                                                        {({ selected, active }) => (
                                                            <>
                                                                <div className="flex items-center">
                                                                    <span
                                                                        className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                                    >
                                                                        {category.name}
                                                                    </span>
                                                                </div>

                                                                {selected ? (
                                                                    <span
                                                                        className={classNames(
                                                                            active ? 'text-white' : 'text-indigo-600',
                                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                        )}
                                                                    >
                                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Listbox>
                    )
                }
            </div>
        </>
    )
}