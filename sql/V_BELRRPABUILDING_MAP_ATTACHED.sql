-- Список вложений, связанных со зданиями
CREATE OR REPLACE FORCE EDITIONABLE VIEW "PARUS"."V_BELRRPABUILDING_MAP_ATTACHED" ("BUILDING_ID", "ID", "PATH", "TYPE_ID", "TYPE_NAME", "TYPE_CODE", "NOTE") AS 
SELECT
	s.trn 		AS building_rn,
	s.frn 		AS rn,
	f.file_path AS path,
	f.file_type AS type_rn,
	t.name 		AS type_name,
	t.code 		AS type_code,
	f.note		AS note
FROM filelinks f
INNER JOIN (
	SELECT
		u.filelinks_prn AS frn,
		u.table_prn AS trn
	FROM filelinksunits u
	INNER JOIN rrpabuilding b ON b.rn = u.table_prn
) s ON s.frn = f.rn
LEFT JOIN flinktypes t ON t.rn = f.file_type;

GRANT SELECT ON "PARUS"."V_BELRRPABUILDING_MAP_ATTACHED" TO PUBLIC;
