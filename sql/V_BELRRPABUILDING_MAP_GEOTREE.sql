-- Дерево геообъектов Белгородской обл.
CREATE OR REPLACE FORCE EDITIONABLE VIEW "PARUS"."V_BELRRPABUILDING_MAP_GEOTREE" ("RN", "PRN", "LOCALITYKIND", "ROW_NUM", "ROW_LEVEL", "GEOGR_NAME", "GEOGR_TYPE", "GEOGR_TYPE_NAME", "GEOGR_TYPE_FULLNAME") AS 
WITH preselectedgeogr AS (SELECT
			DISTINCT g.rn,
			g.prn,
			g.geogrname,
			g.geogrtype,
			g.localitykind
		FROM geografy g
		WHERE g.geogrtype >= 3
		START WITH g.rn in (SELECT
			b.geografy
		FROM rrpaorgstructure t
		INNER JOIN rrpabuilding b
		ON b.rrpaorgstructure = t.rn)
		CONNECT BY PRIOR g.prn = g.rn),
	preorderedgeogr AS (SELECT
			ps.rn,
			ps.prn,
			ps.geogrname,
			ps.geogrtype,
			ps.localitykind,
			ROWNUM          AS row_num,
			LEVEL           AS row_level
		FROM preselectedgeogr ps
		CONNECT BY PRIOR ps.rn = ps.prn
		ORDER SIBLINGS BY ps.geogrname),
	orderedgeogr AS (SELECT
			rn,
			MIN(prn)            AS prn,
			MIN(localitykind)   AS localitykind,
			MIN(row_num)        AS row_num,
			MAX(row_level)      AS row_level,
			MIN(geogrname)      AS geogrname,
			MIN(geogrtype)      AS geogrtype
		FROM
			preorderedgeogr po
		GROUP BY rn)
SELECT
    o."RN",o."PRN",o."LOCALITYKIND",o."ROW_NUM",o."ROW_LEVEL",o."GEOGRNAME",o."GEOGRTYPE",
    l.name          AS geogrtype_name,
    l.fullname      AS geogrtype_fullname
FROM orderedgeogr o
LEFT JOIN localitytype l ON l.rn = o.localitykind
ORDER BY o.row_num;

GRANT SELECT ON "PARUS"."V_BELRRPABUILDING_MAP_GEOTREE" TO PUBLIC;
