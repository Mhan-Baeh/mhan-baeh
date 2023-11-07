import React from 'react'

type Props = {
  children: JSX.Element
  className?: string
  id?: string
  title?: string
  messageErrors?: string | undefined
}

const FormItem = ({ children, className, id, title, messageErrors }: Props) => (
  <div className={`w-full ${className}`} id={id}>
    {title && <label className="inline-block mb-2 text-gray-500">{title}</label>}
    {children}
    {messageErrors && <p className="text-red-600 mt-1 text-sm">{messageErrors}</p>}
  </div>
)

export default FormItem
