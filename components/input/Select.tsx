"use client";
import ReactSelect from "react-select"
interface SelectProps {
  label: string;
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  options: Record<string, any>[];
  disabled?: boolean;
}
const Select = ({ label, value, onChange, options, disabled }: SelectProps) => {
  return (
    <div className="z-[100]">
          <label className="block text-sm font-medium text-gray-700 pl-2 leading-6">
              {label}
        </label>
          <div className="mt-2">
              <ReactSelect
                  isDisabled={disabled}
                  value={value}
                  onChange={onChange}
                  options={options}
                  isMulti
                  // menuPortalTarget is a prop that allows us to render the dropdown menu in a different container than the default one.
                  // By setting it to document.body, we ensure that the menu is rendered as a child of the document body, rather than as a child of the parent component.
                  // This is important because it allows the dropdown menu to be positioned correctly relative to the rest of the page.
                  // If we didn't set this prop, the menu would be rendered as a child of the parent component, which could cause it to be positioned incorrectly.
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                  classNames={{
                    control: () => "text-sm",
                  }}
              />
     </div>
    </div>
  );
};

export default Select;
