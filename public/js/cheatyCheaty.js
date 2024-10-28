document.querySelectorAll("*").forEach((el) => {
    const classes = el.className.split(" ");

    classes.forEach((cls) => {
        // m-[number]
        // Margin and padding
        if (cls.startsWith("m-")) el.style.margin = `${cls.split("-")[1]}`;
        if (cls.startsWith("mt-")) el.style.marginTop = `${cls.split("-")[1]}`;
        if (cls.startsWith("mr-")) el.style.marginRight = `${cls.split("-")[1]}`;
        if (cls.startsWith("mb-")) el.style.marginBottom = `${cls.split("-")[1]}`;
        if (cls.startsWith("ml-")) el.style.marginLeft = `${cls.split("-")[1]}`;

        if (cls.startsWith("p-")) el.style.padding = `${cls.split("-")[1]}`;
        if (cls.startsWith("pt-")) el.style.paddingTop = `${cls.split("-")[1]}`;
        if (cls.startsWith("pr-")) el.style.paddingRight = `${cls.split("-")[1]}`;
        if (cls.startsWith("pb-")) el.style.paddingBottom = `${cls.split("-")[1]}`;
        if (cls.startsWith("pl-")) el.style.paddingLeft = `${cls.split("-")[1]}`;

        // Border
        if (cls.startsWith("b-")) el.style.borderWidth = `${cls.split("-")[1]}`;
        if (cls.startsWith("border-")) {
            const color = cls.split("-")[1];
            el.style.borderColor = color;
            el.style.borderStyle = "solid";
        }

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


        // Grid
        if (cls === "grid") el.style.display = "grid";
        if (cls.startsWith("grid-cols-")) {
            const cols = cls.split("-")[2];
            el.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        }
        if (cls.startsWith("grid-rows-")) {
            const rows = cls.split("-")[2];
            el.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        }
        if (cls.startsWith("gap-")) el.style.gap = `${cls.split("-")[1]}`;

        // Width, height, and display
        if (cls.startsWith("w-")) el.style.width = `${cls.split("-")[1]}`;
        if (cls.startsWith("h-")) el.style.height = `${cls.split("-")[1]}`;
        if (cls === "block") el.style.display = "block";
        if (cls === "inline-block") el.style.display = "inline-block";
        if (cls === "hidden") el.style.display = "none";

        // Text alignment and font size
        if (cls.startsWith("text-")) {
            const value = cls.split("-")[1];
            if (value === "center") el.style.textAlign = "center";
            if (value === "left") el.style.textAlign = "left";
            if (value === "right") el.style.textAlign = "right";
            if (!isNaN(value)) el.style.fontSize = `${value}`;
        }

        // Background color
        if (cls.startsWith("bg-")) {
            const color = cls.split("-")[1];
            el.style.backgroundColor = color;
        }

        // Text color
        if (cls.startsWith("text-color-")) {
            const color = cls.split("-")[2];
            el.style.color = color;
        }

        // Flex grow, shrink, and basis
        if (cls.startsWith("flex-grow-")) el.style.flexGrow = cls.split("-")[2];
        if (cls.startsWith("flex-shrink-")) el.style.flexShrink = cls.split("-")[2];
        if (cls.startsWith("basis-")) el.style.flexBasis = `${cls.split("-")[1]}`;
    });
});
