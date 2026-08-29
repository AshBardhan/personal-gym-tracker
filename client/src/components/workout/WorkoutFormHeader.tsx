import { ReactNode } from "react";
import { Save, X } from "lucide-react";
import Button from "../ui/Button";
import Text from "../ui/Text";

interface WorkoutFormHeaderProps {
  title: string;
  onCancel: () => void;
  /** Optional trailing content (defaults to Cancel + Save) */
  actions?: ReactNode;
}

/**
 * Form page header: title + actions on one row.
 * Mobile/tablet show icon-only Cancel/Save; desktop shows labels.
 */
const WorkoutFormHeader = ({
  title,
  onCancel,
  actions,
}: WorkoutFormHeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between gap-3">
      <Text variant="h2" className="m-0 min-w-0 truncate">
        {title}
      </Text>

      {actions ?? (
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            title="Cancel"
            aria-label="Cancel"
            className="px-2.5 lg:px-4"
          >
            <X size={18} className="lg:hidden" aria-hidden />
            <span className="hidden lg:inline">Cancel</span>
          </Button>
          <Button
            type="submit"
            variant="primary"
            title="Save"
            aria-label="Save"
            className="px-2.5 lg:px-4"
          >
            <Save size={18} className="lg:hidden" aria-hidden />
            <span className="hidden lg:inline">Save</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default WorkoutFormHeader;
