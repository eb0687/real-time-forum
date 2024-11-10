
export const applyTailwind = () => document.querySelectorAll("*").forEach(
    /**
     * 
     * @param {HTMLElement} el 
     */
    (el) => {





        const classes = el.className.split(" ");
        const colors = {
            pr: "black",
            sec: "gray",
            success: "#28a745",
            danger: "#dc3545",
            warning: "#ffc107",
            info: "#17a2b8",
            border: "white",
        }

        classes.forEach((cls) => {
            
            const first = cls.split("-")[1];
            // m-[number]
            // Margin and padding
            if (cls.startsWith("m-")) el.style.margin = `${first}`;
            if (cls.startsWith("mt-")) el.style.marginTop = `${first}`;
            if (cls.startsWith("mr-")) el.style.marginRight = `${first}`;
            if (cls.startsWith("mb-")) el.style.marginBottom = `${first}`;
            if (cls.startsWith("ml-")) el.style.marginLeft = `${first}`;

            if (cls.startsWith("p-")) el.style.padding = `${first}`;
            if (cls.startsWith("pt-")) el.style.paddingTop = `${first}`;
            if (cls.startsWith("pr-")) el.style.paddingRight = `${first}`;
            if (cls.startsWith("pb-")) el.style.paddingBottom = `${first}`;
            if (cls.startsWith("pl-")) el.style.paddingLeft = `${first}`;


            // Flexbox
            if (cls === "flex") el.style.display = "flex";
            if (cls === "flex-col") el.style.flexDirection = "column";
            if (cls === "flex-row") el.style.flexDirection = "row";
            if (cls === "items-center") el.style.alignItems = "center";
            if (cls === "items-start") el.style.alignItems = "flex-start";
            if (cls === "items-end") el.style.alignItems = "flex-end";
            if (cls === "justify-center") el.style.justifyContent = "center";
            if (cls === "justify-between") el.style.justifyContent = "space-between";
            if (cls === "justify-around") el.style.justifyContent = "space-around";
            if (cls === "justify-start") el.style.justifyContent = "flex-start";
            if (cls === "justify-end") el.style.justifyContent = "flex-end";



            // // Grid
            // if (cls === "grid") el.style.display = "grid";
            // if (cls.startsWith("grid-cols-")) {
            //     const cols = cls.split("-")[2];
            //     el.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            // }
            // if (cls.startsWith("grid-rows-")) {
            //     const rows = cls.split("-")[2];
            //     el.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
            // }
            if (cls.startsWith("gap-")) el.style.gap = `${first}`;

            // Width, height, and display
            if (cls.startsWith("w-")) el.style.width = `${first}`;
            if (cls.startsWith("h-")) el.style.height = `${first}`;
            if (cls === "block") el.style.display = "block";
            if (cls === "inline-block") el.style.display = "inline-block";
            if (cls === "hidden") el.style.display = "none";

            // Text alignment and font size
            if (cls.startsWith("text-")) {
                const value = first;
                if (value === "center") el.style.textAlign = "center";
                if (value === "left") el.style.textAlign = "left";
                if (value === "right") el.style.textAlign = "right";
                if (!isNaN(value)) el.style.fontSize = `${value}`;
            }

            // Background color
            if (cls.startsWith("bg-")) {
                const color = first;
                el.style.backgroundColor = color;
            }

            // Text color
            if (cls.match(/text-[a-z]+/)) {
                const color = first;
                el.style.color = color;
            }

            // b-[number]-[color]
            if (cls.startsWith("b-")) {
                el.style.borderWidth = `${cls.split("-")[1]}`;
                el.style.borderColor = colors[cls.split("-")[2]];
                el.style.borderStyle = "solid";
            }

            // Flex grow, shrink, and basis
            if (cls.startsWith("flex-grow-")) el.style.flexGrow = cls.split("-")[2];
            // if (cls.startsWith("flex-shrink-")) el.style.flexShrink = cls.split("-")[2];
            // if (cls.startsWith("basis-")) el.style.flexBasis = `${num}`;
            if (cls === "w-full") el.style.width = "100%";
            if (cls === "h-full") el.style.height = "100%";
            if (cls === "w-fit") el.style.width = "fit-content";
            if (cls === "h-fit") el.style.height = "fit-content";

            if (cls === "rounded") el.style.borderRadius = "5px";
            if (cls === "rounded-full") el.style.borderRadius = "50%";
            if (cls === "rounded-lg") el.style.borderRadius = "10px";
            if (cls === "rounded-xl") el.style.borderRadius = "15px";
            
        });
    });
