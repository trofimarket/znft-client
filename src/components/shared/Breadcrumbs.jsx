import React from "react"
import {ChevronRightIcon, HomeIcon} from '@heroicons/react/solid'

const pages = [
    {name: 'Projects', href: '#', current: false},
    {name: 'Project Nero', href: '#', current: true},
]

const Breadcrumbs = ({path}) => {
    return (
        <nav className="flex px-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
                <li>
                    <div>
                        <a href="#" className="text-gray-400 hover:text-gray-500">
                            <HomeIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true"/>
                            <span className="sr-only">Home</span>
                        </a>
                    </div>
                </li>
                {path.map((name, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <ChevronRightIcon className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true"/>
                            <a
                                href="#"
                                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                                aria-current={name}
                            >
                                {name}
                            </a>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default Breadcrumbs