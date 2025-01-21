import {motion} from 'framer-motion';

export default function Logo() {
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{opacity: 0, x: -20}}
      animate={{opacity: 1, x: 0}}
      transition={{duration: 0.5}}
    >
      <motion.div
        className="relative w-10 h-10 rounded-xl
          flex items-center justify-center "
        whileHover={{scale: 1.05, rotate: 5}}
        whileTap={{scale: 0.95}}
      >
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0"
          whileHover={{opacity: 0.4}}
          transition={{duration: 0.2}}
        />
        {/*<Zap className="w-6 h-6 text-white" />*/}
        <img src="./logo.png" alt="logo" />
      </motion.div>

      <div className="flex flex-col">
        <motion.span
          className="font-bold text-xl bg-gradient-to-r from-primary-700 to-primary-500
            bg-clip-text text-transparent tracking-tight"
          whileHover={{scale: 1.02}}
        >
          AL ZAEEM AI
        </motion.span>
        <span className="text-[10px] text-gray-500 font-medium tracking-wider">
          PREDICTIVE ANALYTICS
        </span>
      </div>
    </motion.div>
  );
}