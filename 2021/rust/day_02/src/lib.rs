#[derive(Clone, Debug, PartialEq)]
pub enum Direction {
    Forward,
    Down,
    Up,
}
use Direction::*;

#[derive(Debug, PartialEq)]
pub struct ParseDirectionError;

impl std::str::FromStr for Direction {
    type Err = ParseDirectionError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "forward" => Ok(Self::Forward),
            "down" => Ok(Self::Down),
            "up" => Ok(Self::Up),
            _ => Err(ParseDirectionError),
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub struct Position(u32, u32, u32);

#[derive(Debug, PartialEq)]
pub struct Program(Vec<(Direction, u32)>);

#[derive(Debug, PartialEq)]
pub struct ParseProgramError;

impl std::str::FromStr for Program {
    type Err = ParseProgramError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let tokens: Vec<_> = s.split_whitespace().collect();
        let commands = tokens
            .chunks_exact(2)
            .map(|chunk| match (chunk[0].parse(), chunk[1].parse()) {
                (Ok(dir), Ok(mag)) => Ok((dir, mag)),
                _ => Err(ParseProgramError),
            })
            .collect::<Result<_, _>>()?;
        Ok(Self(commands))
    }
}

impl Program {
    pub fn run1(&self, pos: Position) -> Position {
        let mut pos = pos.clone();
        for (dir, x) in &self.0 {
            match dir {
                Forward => pos.0 += x,
                Down => pos.1 += x,
                Up => pos.1 -= x,
            };
        }
        pos
    }

    pub fn run2(&self, pos: Position) -> Position {
        let mut pos = pos.clone();
        for (dir, x) in &self.0 {
            match dir {
                Forward => {
                    pos.0 += x;
                    pos.1 += pos.2 * x;
                }
                Down => pos.2 += x,
                Up => pos.2 -= x,
            };
        }
        pos
    }
}

#[cfg(test)]
mod day_02 {
    use crate::*;

    const INPUT: &str = include_str!("../input.txt");

    const EXAMPLE_INPUT: &str = "\
        forward 5\n\
        down 5\n\
        forward 8\n\
        up 3\n\
        down 8\n\
        forward 2\n\
    ";

    const EXAMPLE_COMMANDS: [(Direction, u32); 6] = [
        (Forward, 5),
        (Down, 5),
        (Forward, 8),
        (Up, 3),
        (Down, 8),
        (Forward, 2),
    ];

    #[test]
    fn test_steps_parse() {
        assert_eq!(
            EXAMPLE_INPUT.parse(),
            Ok(Program(EXAMPLE_COMMANDS.to_vec()))
        );
    }

    #[test]
    fn test_run1() {
        let pos = Program(EXAMPLE_COMMANDS.to_vec()).run1(Position(0, 0, 0));
        assert_eq!(pos, Position(15, 10, 0));
        assert_eq!(pos.0 * pos.1, 150);
    }

    #[test]
    fn test_run2() {
        let pos = Program(EXAMPLE_COMMANDS.to_vec()).run2(Position(0, 0, 0));
        assert_eq!(pos, Position(15, 60, 10));
        assert_eq!(pos.0 * pos.1, 900);
    }

    #[test]
    fn part_1() {
        let prog: Program = INPUT.parse().unwrap();
        let pos = prog.run1(Position(0, 0, 0));
        assert_eq!(pos.0 * pos.1, 1635930);
    }

    #[test]
    fn part_2() {
        let prog: Program = INPUT.parse().unwrap();
        let pos = prog.run2(Position(0, 0, 0));
        assert_eq!(pos.0 * pos.1, 1781819478);
    }
}
