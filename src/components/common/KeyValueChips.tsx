import {AnimatePresence, motion} from "framer-motion";
import {useState} from "react";
import {replaceUnderscoreAndHyphen} from "../../utils";
import {Tooltip} from "./Tooltip.tsx";

interface Props {
  data: Record<string, string | string[]>,
  maxChips?: number,
  maxChipLength?: number,
  beautify?: boolean,
}

"flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm"

export function KeyValueChips({data, maxChips = 5, maxChipLength = 30, beautify = false}: Props) {
  const keys = Object.keys(data)
  const remaining = keys.length - Math.min(maxChips, keys.length)
  const [expanded, setExpanded] = useState<boolean>(false)

  return <div>
    <div className="flex flex-wrap justify-start items-center gap-1">
      <AnimatePresence mode="wait">
        {
          keys.slice(0, expanded ? keys.length : keys.length - remaining).map((key) => {
            const entry = beautify ? replaceUnderscoreAndHyphen(key + ": " + (data[key] instanceof Array ? data[key].join(', ') : data[key])): (key + ": " + (data[key] instanceof Array ? data[key].join(',') : data[key]))
            const trimmed_entry = entry.length > maxChipLength ? entry.substring(0, maxChipLength - 3) + "..." : entry
            return <motion.div key={key}
                               initial={{opacity: 0, scale: 0}}
                               animate={{opacity: 1, scale: 1}}
                               exit={{opacity: 0, scale: 0}}
                               className="group/type relative px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">
              {trimmed_entry}
              {entry.length > maxChipLength &&
                <Tooltip>
                  {entry}
                </Tooltip>
              }
            </motion.div>
          })
        }

        {remaining > 0 && !expanded &&
          <motion.button key={0} onClick={() => setExpanded(true)}
                         initial={{opacity: 0, scale: 0}}
                         animate={{opacity: 1, scale: 1}}
                         exit={{opacity: 0, scale: 0}}
                         className="px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">
            {`+${remaining} more`}
          </motion.button>
        }

        {remaining > 0 && expanded &&
          <motion.button key={1} onClick={() => setExpanded(false)}
                         initial={{opacity: 0, scale: 0}}
                         animate={{opacity: 1, scale: 1}}
                         exit={{opacity: 0, scale: 0}}
                         className="ml-auto px-2 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium">
            collapse
          </motion.button>
        }
      </AnimatePresence>
    </div>
  </div>
}