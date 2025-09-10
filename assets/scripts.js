const yearDropdown = document.getElementById("year");
        const makeDropdown = document.getElementById("make");
        const modelDropdown = document.getElementById("model");
        const productTypeDropdown = document.getElementById("productType");
        const findPartButton = document.getElementById("findPartButton");

        let data = {};

        // Enable/disable the findMyPart button
        function updateFindPartButton() {
            if (yearDropdown.value && makeDropdown.value && modelDropdown.value && productTypeDropdown.value) {
                findPartButton.disabled = false;
            } else {
                findPartButton.disabled = true;
            }
        }

        // Parse CSV data 
        function parseCSV(content) {
            const lines = content.split("\n").slice(1).map(line => line.split(",")); // Skip header 
            data = {};

            lines.forEach(([year, make, model, productType, url]) => {
                if (!data[year]) data[year] = {};
                if (!data[year][make]) data[year][make] = {};
                if (!data[year][make][model]) data[year][make][model] = [];
                data[year][make][model].push({ productType, url });
            });

            populateYearDropdown();
        }

        // Populate yearDropdown
        function populateYearDropdown() {
            yearDropdown.innerHTML = '<option value="" disabled selected hidden>Select Year</option>';
            const years = Object.keys(data).filter(year => year.trim() !== ""); // Remove empty entries
            years.forEach(year => {
                const option = document.createElement("option");
                option.value = year;
                option.textContent = year;
                yearDropdown.appendChild(option);
            });
            yearDropdown.disabled = false;
            
            // Auto-select if only one option
            if (years.length === 1) {
                yearDropdown.value = years[0];
                yearDropdown.dispatchEvent(new Event('change'));
            }
        }

        // Year dropdown
        yearDropdown.addEventListener("change", () => {
            const selectedYear = yearDropdown.value;
            makeDropdown.innerHTML = '<option value="" disabled selected hidden>Select Make</option>';
            modelDropdown.innerHTML = '<option value="" disabled selected hidden>Select Model</option>';
            productTypeDropdown.innerHTML = '<option value="" disabled selected hidden>Select Product Type</option>';
            modelDropdown.disabled = true;
            productTypeDropdown.disabled = true;

            if (selectedYear) {
                const makes = Object.keys(data[selectedYear]);
                makes.forEach(make => {
                    const option = document.createElement("option");
                    option.value = make;
                    option.textContent = make;
                    makeDropdown.appendChild(option);
                });
                makeDropdown.disabled = false;
                
                // Auto-select if only one option
                if (makes.length === 1) {
                    makeDropdown.value = makes[0];
                    makeDropdown.dispatchEvent(new Event('change'));
                }
            } else {
                makeDropdown.disabled = true;
            }
            updateFindPartButton();
        });

        //Make dropdown
        makeDropdown.addEventListener("change", () => {
            const selectedYear = yearDropdown.value;
            const selectedMake = makeDropdown.value;
            modelDropdown.innerHTML = '<option value="" disabled selected hidden>Select Model</option>';
            productTypeDropdown.innerHTML = '<option value="" disabled selected hidden>Select Product Type</option>';
            productTypeDropdown.disabled = true;

            if (selectedMake) {
                const models = Object.keys(data[selectedYear][selectedMake]);
                models.forEach(model => {
                    const option = document.createElement("option");
                    option.value = model;
                    option.textContent = model;
                    modelDropdown.appendChild(option);
                });
                modelDropdown.disabled = false;
                
                // Auto-select if only one option
                if (models.length === 1) {
                    modelDropdown.value = models[0];
                    modelDropdown.dispatchEvent(new Event('change'));
                }
            } else {
                modelDropdown.disabled = true;
            }
            updateFindPartButton();
        });

        // Model dropdown
        modelDropdown.addEventListener("change", () => {
            const selectedYear = yearDropdown.value;
            const selectedMake = makeDropdown.value;
            const selectedModel = modelDropdown.value;
            productTypeDropdown.innerHTML = '<option value="" disabled selected hidden>Select Product Type</option>';

            if (selectedModel) {
                const productTypes = data[selectedYear][selectedMake][selectedModel];
                productTypes.forEach(({ productType, url }) => {
                    const option = document.createElement("option");
                    option.value = url;
                    option.textContent = productType;
                    productTypeDropdown.appendChild(option);
                });
                productTypeDropdown.disabled = false;
                
                // Auto-select if only one option
                if (productTypes.length === 1) {
                    productTypeDropdown.value = productTypes[0].url;
                    productTypeDropdown.dispatchEvent(new Event('change'));
                }
            } else {
                productTypeDropdown.disabled = true;
            }
            updateFindPartButton();
        });

        // Product Type dropdown
        productTypeDropdown.addEventListener("change", updateFindPartButton);

        // Find My Part button
        findPartButton.addEventListener("click", () => {
            const selectedURL = productTypeDropdown.value;
            if (selectedURL) {
                window.open(selectedURL, "_blank");
            }
        });

        // Loading the csv file
        fetch("assets/Year Make Model Product Type Dataset Updated.csv")
            .then(response => response.text())
            .then(content => parseCSV(content))
            .catch(error => console.error("Error loading CSV data file:", error));