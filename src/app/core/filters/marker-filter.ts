// есть ли точка в кластере
export const FiilterById  = (idsList) => {
    const ids = idsList;
    return mapFeature => {
        const features =  mapFeature.get('features');

        return features
            ? features.some( el => {
                const prop = el.getProperties().properties;
                return prop
                    ? ids[prop.id]
                    : false;
            })
        : false;
    };
};
