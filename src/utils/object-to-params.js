const ObjectDeserializer = {
    objectToParams: (obj) => {

        const result = Object.keys(obj)?.map(x => {
            const value = obj[x];

            return `${x}=${value}`;
        });

        return result.join("&");
    }
}

export default ObjectDeserializer